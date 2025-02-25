using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Watchtogether_Backend.Data;
using Watchtogether_Backend.Models;
using Microsoft.AspNetCore.JsonPatch;


namespace Watchtogether_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly DataContext _context;



        public RoomController(DataContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllRoom()
        {
            var Room = _context.Room.ToList();
            return Ok(Room);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetRoomById(string id)
        {
            var Room = _context.Room.Where(x => x.RoomId == id);
            if (Room == null)
            {
                return NotFound("Room not found.");
            }
            return Ok(Room);
        }

        [HttpGet("roomCode/")]
        public async Task<IActionResult> GetRoomByCode([FromQuery] string roomCode)
        {
            var Room = _context.Room.Where(x => x.RoomCode == roomCode);
            return Ok(Room);
        }



        [HttpPost]

        public async Task<IActionResult> AddRoom(Room room)
        {
            _context.Room.Add(room);
            await _context.SaveChangesAsync();
            return Ok(await _context.Room.ToListAsync());
        }

        [HttpPut]

        public async Task<IActionResult> UpdateRoom(Room updatedRoom)
        {
            var dbRoom = await _context.Room.FindAsync(updatedRoom.RoomId);
            if (dbRoom is null)
                return NotFound("Room Not Found");
            dbRoom.RoomId = updatedRoom.RoomId;
            dbRoom.RoomName = updatedRoom.RoomName;
            dbRoom.RoomCode = updatedRoom.RoomCode;
            dbRoom.CurrentVideo = updatedRoom.CurrentVideo;

            await _context.SaveChangesAsync();

            return Ok(await _context.Room.ToListAsync());
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateRoomPartial(string id, JsonPatchDocument<Room> patchDocument)
        {
            var room = await _context.Room.FirstOrDefaultAsync(x => x.RoomId == id);
            if (room == null)
            {
                return NotFound("Room Not Found");
            }

            patchDocument.ApplyTo(room);

            if (!TryValidateModel(room))
            {
                return BadRequest(ModelState);
            }

            await _context.SaveChangesAsync();

            return Ok(room);
        }


        [HttpDelete]

        public async Task<IActionResult> DeleteRoom(int id)
        {
            var Room = await _context.Room.FindAsync(id);
            if (Room == null)
                return NotFound("Room not found.");
            _context.Room.Remove(Room);
            await _context.SaveChangesAsync();

            return Ok(Room);
        }

    }
}