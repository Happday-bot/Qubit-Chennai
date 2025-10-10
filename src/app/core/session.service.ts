export class SessionService {
  private ws: WebSocket | null = null;
  private channel = new BroadcastChannel('session_channel');

  connect(userId: number) {
    const isSecure = window.location.protocol === 'https:';
    const wsProtocol = isSecure ? 'wss' : 'ws';
    this.ws = new WebSocket(`${wsProtocol}://localhost:8000/ws/session/${userId}`);
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'FORCE_LOGOUT') {
        this.channel.postMessage(msg);
        this.logout();
      }
    };
  }

  logout() {
    fetch("http://localhost:8000/logout", {
    method: "POST",
    credentials: "include"
  }).finally(() => {
    window.location.href = "/login";
  });
  }
}
