class Heartbeat {
  private interval: NodeJS.Timeout | null = null;

  start(milliseconds: number): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      console.log("[HEARTBEAT] I'm alive!");
    }, milliseconds);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default new Heartbeat();
