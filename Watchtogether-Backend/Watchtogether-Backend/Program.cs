using Microsoft.EntityFrameworkCore;
using Watchtogether_Backend.Authentication;
using Watchtogether_Backend.Data;
using Watchtogether_Backend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("reactApp", builder =>
    {
        builder.WithOrigins("https://c2f6-99-127-95-111.ngrok-free.app", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
    opt.AddPolicy("youtube", builder =>
    {
        builder.WithOrigins("https://youtube.com")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("reactApp");
app.UseCors("youtube");


app.UseAuthorization();
app.MapControllers();

app.MapHub<ChatHub>("/Chat");






//app.UseMiddleware<ApiKeyAuthMiddleware>();

app.Run();
