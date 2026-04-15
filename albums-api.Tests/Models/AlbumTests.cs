using albums_api.Models;

namespace albums_api.Tests.Models;

public class AlbumTests
{
    [Fact]
    public void GetById_ReturnsExpectedAlbumWithArtist()
    {
        // Arrange
        const int id = 1;

        // Act
        var album = Album.GetById(id);

        // Assert
        Assert.NotNull(album);
        Assert.Equal("You, Me and an App Id", album.Title);
        Assert.NotNull(album.Artist);
        Assert.Equal("Daprize", album.Artist.Name);
        Assert.Equal("Seattle, USA", album.Artist.BirthPlace);
    }

    [Fact]
    public void Create_AddsAlbum_ThenDeleteRemovesIt()
    {
        // Arrange
        var artist = new Artist("Unit Test Artist", new DateTime(1999, 1, 1), "Manchester, UK");

        // Act
        var created = Album.Create("Unit Test Album", artist, 9.99, "https://example.com/image.png", 2026);

        // Assert create
        Assert.True(created.Id > 0);
        var found = Album.GetById(created.Id);
        Assert.NotNull(found);
        Assert.Equal("Unit Test Album", found.Title);
        Assert.Equal("Unit Test Artist", found.Artist.Name);

        // Cleanup + assert delete
        var deleted = Album.Delete(created.Id);
        Assert.True(deleted);
        Assert.Null(Album.GetById(created.Id));
    }
}
