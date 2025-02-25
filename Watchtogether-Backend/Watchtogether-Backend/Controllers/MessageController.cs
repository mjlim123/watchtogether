using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Watchtogether_Backend.Data;
using Watchtogether_Backend.Models;

namespace Watchtogether_Backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : Controller
    {
        private readonly DataContext _context;



        public MessageController(DataContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllMessages()
        {
            var Message = await _context.Message.ToListAsync();
            return Ok(Message);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetMessageById(string id)
        {
            var Message =  _context.Message.Where(x => x.MessageId == id);
            if (Message == null)
            {
                return NotFound("Room not found.");
            }
            return Ok(Message);
        }

        [HttpGet("roomID")]
        public async Task<IActionResult> GetMessageByRoomId(string id)
        {
            var Message =  _context.Message.Where(x => x.RoomId == id);
            if (Message == null)
            {
                return NotFound("Room not found.");
            }
            return Ok(Message);
        }


        [HttpPost]

        public async Task<IActionResult> AddMessage(Message message)
        {
            _context.Message.Add(message);
            await _context.SaveChangesAsync();
            return Ok(await _context.Message.ToListAsync());
        }

        [HttpPut]

        public async Task<IActionResult> UpdateMessage(Message updatedMessage)
        {
            var dbMessage = await _context.Message.FindAsync(updatedMessage.MessageId);
            if (dbMessage is null)
                return NotFound("Room Not Found");
            dbMessage.MessageId = updatedMessage.MessageId;
            dbMessage.MessageId = updatedMessage.MessageId;

            await _context.SaveChangesAsync();

            return Ok(await _context.Message.ToListAsync());
        }

        [HttpDelete]

        public async Task<IActionResult> DeleteMessage(string id)
        {
            var Message = await _context.Message.FindAsync(id);
            if (Message == null)
                return NotFound("Message not found.");
            _context.Message.Remove(Message);
            await _context.SaveChangesAsync();

            return Ok(Message);
        }




    }

}

