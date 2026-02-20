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
    }
}
