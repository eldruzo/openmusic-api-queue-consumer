class Listener {
  constructor(playlistsService, mailSender) {
    this._mailSender = mailSender;
    this._playlistsService = playlistsService;

    this.listen = this.listen.bind(this);
  }
 
  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(message.content.toString());

      const playlistData = await this._playlistsService.getPlaylistData(playlistId);
      
      const result = await this._mailSender.sendEmail(
        targetEmail, 
        JSON.stringify(playlistData), 
        {
          id: playlistData.id, 
          name: playlistData.name,
        }, 
      );

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
 
module.exports = Listener;
