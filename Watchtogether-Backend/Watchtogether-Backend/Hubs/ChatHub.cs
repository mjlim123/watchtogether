using Microsoft.AspNetCore.SignalR;
using Microsoft.Identity.Client;
using System.Diagnostics;
using Watchtogether_Backend.Models;

namespace Watchtogether_Backend.Hubs
{
    public class ChatHub : Hub 
    {

        public async Task JoinSpecificChatRoom(string user, string code)
        {
            // Add the connection to the specified group (chat room)
            await Groups.AddToGroupAsync(Context.ConnectionId, code);
            // Notify clients in the group that a user has joined
            await Clients.Group(code).SendAsync("SendNotification", user);
        }

        public async Task SendMessage(string user, string message, string code)
        {
            // Broadcast the message to all clients in the specified group (chat room)
            await Clients.Group(code).SendAsync("MessageSent", user, message, code);

        }

        public async Task PauseVideo(string user, string code)
        {
            await Clients.Group(code).SendAsync("VideoPaused", user);
        }


        public async Task PlayVideo(string user, string code)
        {
            await Clients.Group(code).SendAsync("VideoPlayed", user);
        }

        public async Task MoveVideoTime(string user, string code, float time)
        {
    
            await Clients.Group(code).SendAsync("VideoTimeMoved",user, time);
        }

        public async Task ChangeVideo(string user, string code, string videoId)
        {

            await Clients.Group(code).SendAsync("VideoChanged", $"{user} sent the video id:",  videoId);
        }


    }
} 
