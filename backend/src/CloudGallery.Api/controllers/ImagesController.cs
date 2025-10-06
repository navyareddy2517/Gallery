using CloudGallery.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CloudGallery.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly IImageService _imageService;
        private readonly ILogger<ImagesController> _logger;

        public ImagesController(IImageService imageService, ILogger<ImagesController> logger)
        {
            _imageService = imageService;
            _logger = logger;
        }

        // Upload image
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file selected.");

            var imageUrl = await _imageService.SaveImageAsync(file);
            if (imageUrl == null)
                return BadRequest("Upload failed.");

            return Ok(new { Url = imageUrl });
        }

        // Get all images
        [HttpGet("all")]
        public IActionResult GetAll()
        {
            var images = _imageService.GetAllImages();
            return Ok(images);
        }

        // Get single image
        [HttpGet("{fileName}")]
        public IActionResult Get(string fileName)
        {
            var image = _imageService.GetImage(fileName);
            if (image == null)
                return NotFound();

            return Ok(image);
        }

        // Delete image
        [HttpDelete("{fileName}")]
        public IActionResult Delete(string fileName)
        {
            var success = _imageService.DeleteImage(fileName);
            if (!success)
                return NotFound();

            return Ok(new { Message = "Deleted successfully" });
        }
    }
}
