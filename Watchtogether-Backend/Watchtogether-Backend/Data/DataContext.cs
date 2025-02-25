using Microsoft.EntityFrameworkCore;
using Watchtogether_Backend.Models;

namespace Watchtogether_Backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        {
            
        }

        public DbSet<User> User { get; set; }
        public DbSet<Room> Room { get; set; }

        public DbSet<Message> Message { get; set; }


    }
}
