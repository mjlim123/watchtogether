using System.ComponentModel.DataAnnotations;

namespace Watchtogether_Backend.Models
{
    public class User
    {

        [Key]
        public string UserId { get; set; } = Guid.NewGuid().ToString();
        public string UserName { get; set; } = String.Empty;

    }
}
