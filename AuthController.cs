using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EducationalPlatform.API.Models;
using EducationalPlatform.API.Data;
using EducationalPlatform.API.Helpers;
using EducationalPlatform.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly EducationalPlatformDbContext _context;

        public AuthController(EducationalPlatformDbContext context)
        {
            _context = context;
        }

        // ===================== REGISTER =====================
        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginDto model)
        {
            // 1️⃣ تحقق من وجود الإيميل
            var exists = _context.Users.Any(u => u.Email == model.Email);
            if (exists)
                return BadRequest("الإيميل مستخدم بالفعل");

            // 2️⃣ إنشاء يوزر جديد
            var user = new User
            {
                Email = model.Email,
                PasswordHash = PasswordHelper.HashPassword(model.Password),
                Role = "Student",
                CreatedAt = DateTime.UtcNow
            };

            // 3️⃣ حفظ في الداتا بيز
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("تم إنشاء الحساب بنجاح");
        }

        // ===================== LOGIN =====================
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto model)
        {
            // 1️⃣ هات اليوزر من الداتا بيز
            var user = _context.Users
                .FirstOrDefault(u => u.Email == model.Email);

            if (user == null)
                return Unauthorized("بيانات الدخول غير صحيحة");

            // 2️⃣ اعمل Hash للباسورد اللي داخل
            if (!PasswordHelper.VerifyPassword(model.Password, user.PasswordHash))
                return Unauthorized("بيانات الدخول غير صحيحة");

            // 3️⃣ Claims
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // 4️⃣ JWT
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_A_VERY_LONG_SUPER_SECRET_KEY_123456789")
            );

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256
                )
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
    }
}

