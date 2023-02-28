import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SockerIoService {

  public readonly localStream$: BehaviorSubject<MediaStream | MediaSource | Blob> = new BehaviorSubject(null);
  public readonly remoteStreams$: BehaviorSubject<StreamObject[]> = new BehaviorSubject([]);

  private readonly socket = io.connect(environment.wssUrl);
  private readonly peerConnections: { [id: string]: RTCPeerConnection } = {};

  // private room = !location.pathname.substring(1) ? environment.defaultRoom : location.pathname.substring(1);
  private room = environment.defaultRoom;
  private getUserMediaAttempts = environment.maxMediaAttemps || 5;
  private readonly gettingUserMedia$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private readonly config: RTCConfiguration = environment.defaultRtcConfig || {
    iceServers: [{
      urls: ['stun:stun.l.google.com:19302']
    }]
  };

  private readonly constraints: MediaStreamConstraints = environment.defaultMediaConstraints || {
    audio: true,
    video: { facingMode: 'user' }
  };


  constructor() { }
  /**
   * Creates Room and Socket Listeners.
   */
  public init(room) {
    this.getUserMediaDevices();
    this._createRandomRoom(room);
    this._setupSocketListeners();
  }

  private getUserMediaDevices() {
    if (!this.gettingUserMedia$.value) {
        this.gettingUserMedia$.next(true);
        return navigator.mediaDevices.getUserMedia(this.constraints)
        .then((s) => this._getUserMediaSuccessCb(s))
        .catch((e) => this._getUserMediaErrorCb(e));
      }
  }

  private _createRandomRoom(room) {
    // this.room = (Math.random() * 10000).toString();
    this._joinRoom(room);
  }

  private _joinRoom(room: string) {
    this.room = room || this.room;

    if (this.room && !!this.room) {
      console.log(this.room);
      this.socket.emit('join', this.room);
    }
  }

  private _setupSocketListeners() {
    this.socket.on('ready', (id) => this.onReady(id));
    this.socket.on('permission', (id, remoteInfo) => this.onPermission(id, remoteInfo));
    this.socket.on('granted', (id) => this.onGrantedPermission(id));
    this.socket.on('full', (room: string) => this.onFull(room));
    this.socket.on('offer', (id, description) => this.onOffer(id, description));
    this.socket.on('answer', (id, description) => this.onAnswer(id, description));
    this.socket.on('candidate', (id, candidate) => this.onCandidate(id, candidate));
    this.socket.on('bye', (id) => this.onBye(id));
  }
  private _getUserMediaSuccessCb(stream: MediaStream | MediaSource | Blob) {
    this.gettingUserMedia$.next(false);
    this.localStream$.next(stream);

    // this.socket.emit('ready');
  }
  private _getUserMediaErrorCb(error) {
     console.error(error);
     this.gettingUserMedia$.next(false);
     // tslint:disable-next-line: no-unused-expression
     (--this.getUserMediaAttempts > 0) && setTimeout(() => this.getUserMediaDevices(), 1000);
  }

  private _handleRemoteStreamAdded(stream: MediaStream, id: string) {
    const streams = this.remoteStreams$.value;
    // Check if stream is already in Streams
    const index = streams.findIndex((v) => v.id === id);
    if (index === -1) {
      streams.push({ stream, id, local: false });
    } else {
      streams[index] = { stream, id, local: false };
    }

    this.remoteStreams$.next(streams);
  }

  private _handleRemoteStreamRemoved(id: string) {
    let streams = this.remoteStreams$.value;
    streams = streams.filter((s) => s.id === id);
    this.remoteStreams$.next(streams);
  }

  private onReady(id: string) {
    const peerConnection = new RTCPeerConnection(this.config);
    this.peerConnections[id] = peerConnection;

    (peerConnection as any).addStream(this.localStream$.value);
    peerConnection.createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      this.socket.emit('offer', id, peerConnection.localDescription);
    });
    (peerConnection as any).onaddstream = event => this._handleRemoteStreamAdded(event.stream, id);
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('candidate', id, event.candidate);
      }
    };
  }


  /**
   * TODO:
   * Create On Permission
   */
  private onPermission(id: string, remoteInfo: { name: string, ip: string }) { 
    console.log('Permision Requested');
    const result = confirm('Resquested Permission');
    if (result === true) {
      this.socket.emit('granted', id, remoteInfo);
    }
  }

  private onGrantedPermission(id: string) {
    console.log('Grantted to Id: ', id);
    setTimeout(() => this.socket.emit('ready'), 1000);
  }

  /**
   * TODO:
   * On Room Occupancy Full
   */
  private onFull(room: string) {
    alert('Room ' + room + ' is full');
  }

  /**
   * On offer recieved from remote.
   */
  private onOffer(id: string, description: RTCSessionDescriptionInit) {
    const peerConnection = new RTCPeerConnection(this.config);
    this.peerConnections[id] = peerConnection;
    (peerConnection as any).addStream(this.localStream$.value);
    peerConnection.setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      this.socket.emit('answer', id, peerConnection.localDescription);
    });
    (peerConnection as any).onaddstream = event => this._handleRemoteStreamAdded(event.stream, id);
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('candidate', id, event.candidate);
      }
    };
  }

  /**
   * On Answer of Candidate Membership
   */
  private onAnswer(id: string, description: RTCSessionDescriptionInit) {
    this.peerConnections[id].setRemoteDescription(description);
  }
  /**
   * On Candidate Request
   *
   */
  private onCandidate(id: string, candidate: RTCIceCandidateInit) {
    this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
  }

  private onBye(id: string) {
    this._handleRemoteStreamRemoved(id);
  }

}
