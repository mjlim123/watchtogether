using System.ComponentModel.DataAnnotations;

namespace Watchtogether_Backend.Models
{
    public class Message
    {
        [Key]
        public string MessageId { get; set; } = Guid.NewGuid().ToString();
        public string Contents { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;
        public string RoomId { get; set; } = Guid.NewGuid().ToString();

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
