using System.Text.Json;
using ZirkBackend.Database;
using ZirkBackend.Helpers;
using ZirkBackend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton(new JsonSerializerOptions()
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
});
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

var app = builder.Build();

{
    using var scope = app.Services.CreateScope();
    if (!Directory.Exists(PathHelper.DataPath)) Directory.CreateDirectory(PathHelper.DataPath);
    var db = scope.ServiceProvider.GetRequiredService<SqliteContext>();
    db.Database.EnsureCreated();
}
/*
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.IncludeErrorDetails = true;

    using var scope = app!.Services.CreateScope();
    var data = Encoding.UTF8.GetBytes(scope.ServiceProvider.GetRequiredService<ConfigManager>().GetConfig().SecurityKey);
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
});
*/

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("debug");
    app.UseFileServer();
}
else
{
    app.UseHttpsRedirection();
    app.UseCors("prod");
}

app.UseAuthorization();

app.MapControllers();

app.Run();
