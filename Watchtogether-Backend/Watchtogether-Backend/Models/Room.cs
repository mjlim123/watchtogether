using System.ComponentModel.DataAnnotations;

namespace Watchtogether_Backend.Models
{
    public class Room
    {

        [Key]
        public string RoomId { get; set; } = Guid.NewGuid().ToString();
        public string RoomName { get; set; } = string.Empty;

        public string RoomCode { get; set; } = string.Empty;

        public string CurrentVideo {  get; set; } = string.Empty;

  
    }
}
