using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.API.Data;

namespace EducationalPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StagesController : ControllerBase
    {
        private readonly EducationalPlatformDbContext _context;

        public StagesController(EducationalPlatformDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetStages()
        {
            var stages = _context.Stages.ToList();
            return Ok(stages);
        }
    }
}
