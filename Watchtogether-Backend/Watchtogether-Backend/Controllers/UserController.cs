using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Watchtogether_Backend.Data;
using Watchtogether_Backend.Hubs;
using Watchtogether_Backend.Models;

namespace Watchtogether_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;


        public UserController(DataContext context)
        {
            _context = context;
        }

   
        [HttpGet]
        public async Task<IActionResult> GetAllUser()
        {
            var Users = await _context.User.ToListAsync();
            return Ok(Users);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetUser(string id)
        {
            var Users = _context.User.Where(x => x.UserId == id);
            if (Users == null)
            {
                return NotFound("User not found.");
            }
            return Ok(Users);
        }

        [HttpPost]

        public async Task<IActionResult> AddUser(User user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();
            return Ok(await _context.User.ToListAsync());
        }

        [HttpPut]

        public async Task<IActionResult> UpdateUser(User updatedUser)
        {
            var dbUser = await _context.User.FindAsync(updatedUser.UserId);
            if (dbUser is null)
                return NotFound("Hero Not Found");
            dbUser.UserId = updatedUser.UserId;
            dbUser.UserName = updatedUser.UserName;

            await _context.SaveChangesAsync();

            return Ok(await _context.User.ToListAsync());
        }

        [HttpDelete]

        public async Task<IActionResult> DeleteUser(int id)
        {
            var Users = await _context.User.FindAsync(id);
            if (Users == null)
                return NotFound("User not found.");
            _context.User.Remove(Users);
            await _context.SaveChangesAsync();

            return Ok(Users);
        }




    }
}
