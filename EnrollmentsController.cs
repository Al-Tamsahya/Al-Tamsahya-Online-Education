using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.API.Data;
using EducationalPlatform.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly EducationalPlatformDbContext _context;

        public EnrollmentsController(EducationalPlatformDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Enroll(int userId, int subjectId)
        {
            var exists = _context.Enrollments
                .Any(e => e.UserId == userId && e.SubjectId == subjectId);

            if (exists)
                return BadRequest("الطالب مشترك بالفعل");

            var enrollment = new Enrollment
            {
                UserId = userId,
                SubjectId = subjectId
            };

            _context.Enrollments.Add(enrollment);
            _context.SaveChanges();

            return Ok("تم الاشتراك بنجاح");
        }

        [HttpGet("by-user/{userId}")]
        public IActionResult GetUserEnrollments(int userId)
        {
            var enrollments = _context.Enrollments
                .Include(e => e.Subject)
                .Where(e => e.UserId == userId)
                .ToList();

            return Ok(enrollments);
        }
    }
}
