﻿using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Watchtogether_Backend.Authentication
{
    public class ApiKeyAuthMiddleware
    {

        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        

        public ApiKeyAuthMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!context.Request.Headers.TryGetValue(AuthConstants.ApiKeyHeaderHane, out var extractedApiKey))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Api Key Missing");
                return;
            }

            var apiKey = _configuration.GetValue<string>(AuthConstants.ApiKeySectionName);
            if (!apiKey.Equals(extractedApiKey)) 
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Invalid Api Key");
                return;
            }
            await _next(context);
        }

    }
}
