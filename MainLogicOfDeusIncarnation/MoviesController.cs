using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainLogicOfDeusIncarnation
{
    [ApiController]
    [Route("[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MoviesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<List<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }
    }
}
