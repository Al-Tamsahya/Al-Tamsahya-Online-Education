using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.API.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.API.Controllers
{
    [Authorize] // ✅ هنا بالظبط
    [ApiController]
    [Route("api/[controller]")]
    public class LessonsController : ControllerBase
    {
        private readonly EducationalPlatformDbContext _context;

        public LessonsController(EducationalPlatformDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(
                _context.Lessons
                .Include(l => l.Subject)
                .ToList()
            );
        }

        [HttpGet("by-subject/{subjectId}")]
        public IActionResult GetBySubject(int subjectId)
        {
            var lessons = _context.Lessons
                .Where(l => l.SubjectId == subjectId)
                .ToList();

            return Ok(lessons);
        }

        // =======================
        // ✅ ADDED: Create Lesson with Video
        // =======================
        [HttpPost]
        public IActionResult CreateLesson([FromBody] Lesson lesson)
        {
            _context.Lessons.Add(lesson);
            _context.SaveChanges();

            return Ok(lesson);
        }

        // =======================
        // ✅ ADDED: Update Lesson Video
        // =======================
        [HttpPut("{id}/video")]
        public IActionResult UpdateLessonVideo(int id, [FromBody] string videoUrl)
        {
            var lesson = _context.Lessons.Find(id);

            if (lesson == null)
                return NotFound();

            lesson.VideoUrl = videoUrl;
            _context.SaveChanges();

            return Ok(lesson);
        }
    }
}
