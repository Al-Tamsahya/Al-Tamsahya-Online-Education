using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.API.Data;

namespace EducationalPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectsController : ControllerBase
    {
        private readonly EducationalPlatformDbContext _context;

        public SubjectsController(EducationalPlatformDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Subjects.ToList());
        }

        [HttpGet("by-stage/{stageId}")]
        public IActionResult GetByStage(int stageId)
        {
            var subjects = _context.Subjects
                .Where(s => s.StageId == stageId)
                .ToList();

            return Ok(subjects);
        }
    }
}
