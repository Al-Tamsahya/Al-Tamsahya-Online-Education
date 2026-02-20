using EducationalPlatform.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.API.Controllers
{
    [ApiController]
    [Route("api/students")]
    public class StudentsController : ControllerBase
    {
        // مؤقت (بدون Database)
        static List<Student> students = new();

        // حالة تشغيل الموقع
        static bool systemEnabled = true;

        // =========================
        // تسجيل طالب جديد (Pending)
        // POST: /api/students/register
        // =========================
        [HttpPost("register")]
        public IActionResult Register([FromBody] Student student)
        {
            if (!systemEnabled)
                return BadRequest(new { message = "System is disabled" });

            if (student == null || string.IsNullOrWhiteSpace(student.Email))
                return BadRequest(new { message = "Email is required" });

            // منع تكرار البريد
            if (students.Any(s => s.Email == student.Email))
                return BadRequest(new { message = "Email already exists" });

            student.Id = students.Count == 0 ? 1 : students.Max(s => s.Id) + 1;
            student.EnrollmentDate = DateTime.Now;

            // مهم: الطالب يسجل كمعلق
            student.Approved = false;

            students.Add(student);

            return Ok(new { message = "Student registered and pending approval" });
        }

        // =========================
        // عرض كل الطلاب (للمشرف)
        // GET: /api/students
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(students);
        }

        // =========================
        // عرض الطلبات المعلقة فقط (Pending)
        // GET: /api/students/pending
        // =========================
        [HttpGet("pending")]
        public IActionResult GetPending()
        {
            var pending = students.Where(s => s.Approved == false).ToList();
            return Ok(pending);
        }

        // =========================
        // تفعيل طالب (Approve)
        // POST: /api/students/approve/{id}
        // =========================
        [HttpPost("approve/{id}")]
        public IActionResult Approve(int id)
        {
            var student = students.FirstOrDefault(s => s.Id == id);

            if (student == null)
                return NotFound(new { message = "Student not found" });

            student.Approved = true;

            return Ok(new { message = "Student approved" });
        }

        // =========================
        // معرفة حالة الموقع
        // GET: /api/students/status
        // =========================
        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new { enabled = systemEnabled });
        }

        // =========================
        // تشغيل / إيقاف الموقع (للمشرف)
        // POST: /api/students/toggle
        // =========================
        [HttpPost("toggle")]
        public IActionResult ToggleSystem()
        {
            systemEnabled = !systemEnabled;
            return Ok(new { enabled = systemEnabled });
        }
    }
}
