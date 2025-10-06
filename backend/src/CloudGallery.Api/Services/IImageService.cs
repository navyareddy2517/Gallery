using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CloudGallery.Api.Services
{
    public interface IImageService
    {
        Task<string?> SaveImageAsync(IFormFile file);
        IEnumerable<string> GetAllImages();
        string? GetImage(string fileName);
        bool DeleteImage(string fileName);
    }
}
