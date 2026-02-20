using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using EducationalPlatform.API.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//
// =======================
// Services
// =======================
//

// Controllers
builder.Services.AddControllers();

// =======================
// CORS (مهم جدًا – Flutter / Frontend)
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// =======================
// Database
// =======================
builder.Services.AddDbContext<EducationalPlatformDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// =======================
// Authentication (JWT)
// =======================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddAuthorization();

// =======================
// Swagger (اختياري – للتطوير فقط)
// =======================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Educational Platform API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

//
// =======================
// Middleware
// =======================
//

// 🔹 يخدم index.html تلقائي
app.UseDefaultFiles();
app.UseStaticFiles();

// Swagger (اقفله وقت التسليم)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();


// CORS لازم قبل Auth
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value?.ToLower();

    // مسموح دائمًا
    if (
    path!.StartsWith("/api/system") ||
    path.StartsWith("/api/auth") ||
    path.StartsWith("/api/students/register") ||   // ✅ لازم
    path.StartsWith("/index.html") ||
    path == "/" ||
    path.StartsWith("/css") ||
    path.StartsWith("/js") ||
    path.StartsWith("/icons")
)
    {
        await next();
        return;
    }


    // لو النظام مقفول → امنع باقي الطلبات
    if (!EducationalPlatform.API.SystemState.Enabled)
    {
        context.Response.StatusCode = 503;
        await context.Response.WriteAsync("SYSTEM_DISABLED");
        return;
    }

    await next();
});


app.MapControllers();

// ✅ مهم جدًا لـ Render / Railway / أي Hosting بيحدد PORT
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    app.Urls.Add($"http://0.0.0.0:{port}");
}

app.Run();
