using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CloudGallery.Api.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;

        public ImageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string?> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            var uploadsPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var fileName = Path.GetFileName(file.FileName);
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{fileName}";
        }

        public IEnumerable<string> GetAllImages()
        {
            var uploadsPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsPath))
                return Enumerable.Empty<string>();

            return Directory.GetFiles(uploadsPath)
                            .Select(Path.GetFileName)
                            .Select(name => $"/uploads/{name}");
        }

        public string? GetImage(string fileName)
        {
            var uploadsPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            var filePath = Path.Combine(uploadsPath, fileName);
            if (!File.Exists(filePath))
                return null;

            return $"/uploads/{fileName}";
        }

        public bool DeleteImage(string fileName)
        {
            var uploadsPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            var filePath = Path.Combine(uploadsPath, fileName);

            if (!File.Exists(filePath))
                return false;

            File.Delete(filePath);
            return true;
        }
    }
}
