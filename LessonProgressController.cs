using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.API.Data;
using EducationalPlatform.API.Models;

namespace EducationalPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LessonProgressController : ControllerBase
    {
        private readonly EducationalPlatformDbContext _context;

        public LessonProgressController(EducationalPlatformDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult MarkCompleted(int userId, int lessonId)
        {
            var exists = _context.LessonProgresses
                .Any(lp => lp.UserId == userId && lp.LessonId == lessonId);

            if (exists)
                return BadRequest("الدرس متسجل بالفعل");

            var progress = new LessonProgress
            {
                UserId = userId,
                LessonId = lessonId,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow
            };

            _context.LessonProgresses.Add(progress);
            _context.SaveChanges();

            return Ok("تم تسجيل إكمال الدرس");
        }

        [HttpGet("by-user/{userId}")]
        public IActionResult GetProgress(int userId)
        {
            var progress = _context.LessonProgresses
                .Where(lp => lp.UserId == userId)
                .ToList();

            return Ok(progress);
        }
    }
}
