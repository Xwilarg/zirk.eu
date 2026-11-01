using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using ZirkBackend.Database;
using ZirkBackend.Helpers;
using ZirkBackend.Services;

var builder = WebApplication.CreateBuilder(args);

var opts = new JsonSerializerOptions()
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};
builder.Services.AddSingleton(opts);
builder.Services.AddSingleton<Random>();
builder.Services.AddSingleton<FileService>();
builder.Services.AddScoped<ApiUpdater>();
builder.Services.AddDbContext<SqliteContext>();
builder.Services.AddHttpClient();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("debug", p =>
    {
        p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
    });
    options.AddPolicy("prod", p =>
    {
        p.WithOrigins("https://zirk.eu").SetIsOriginAllowedToAllowWildcardSubdomains().AllowAnyHeader().AllowAnyMethod();
    });
});

{

    var creds = PathHelper.GetCredentials(opts);

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.IncludeErrorDetails = true;

        var data = Encoding.UTF8.GetBytes(creds.SecurityKey);
        var securityKey = new SymmetricSecurityKey(data);

        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ClockSkew = TimeSpan.Zero,

            ValidateLifetime = true,

            ValidateAudience = false,
            ValidateIssuer = false,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = securityKey
        };
    })
    .AddCookie("Cookies")
    .AddDiscord(x =>
    {
        x.ClientId = creds.Discord.Id;
        x.ClientSecret = creds.Discord.Secret;
        x.Scope.Add("identify");
        x.SignInScheme = "Cookies";
        x.CallbackPath = "/api/auth/discord";
        x.SaveTokens = true;
    });
}

var app = builder.Build();

{
    using var scope = app.Services.CreateScope();
    if (!Directory.Exists(PathHelper.DataPath)) Directory.CreateDirectory(PathHelper.DataPath);
    var db = scope.ServiceProvider.GetRequiredService<SqliteContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("debug");
    app.UseFileServer();
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedHost | ForwardedHeaders.XForwardedProto
    });
}
else
{
    app.UseHttpsRedirection();
    app.UseCors("prod");
    app.Use((ctx, next) =>
    {
        ctx.Request.Scheme = "https";
        ctx.Request.Host = new HostString("zirk.eu");
        return next();
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
