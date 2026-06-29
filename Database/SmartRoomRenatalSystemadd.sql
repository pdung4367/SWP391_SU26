USE master;
GO

-- 1. Tìm và "Bắn bỏ" (KILL) tất cả các kết nối ngầm đang bám vào database
DECLARE @kill varchar(8000) = '';  
SELECT @kill = @kill + 'kill ' + CONVERT(varchar(5), session_id) + ';'  
FROM sys.dm_exec_sessions
WHERE database_id  = db_id('RentalRoomSystem')
  AND session_id <> @@SPID;

EXEC(@kill);
GO

-- 2. Đặt lại chế độ MULTI_USER (Lúc này chắc chắn không còn ai cản trở)
ALTER DATABASE RentalRoomSystem SET MULTI_USER;
GO

-- 3. Chọn đúng database
USE RentalRoomSystem;
GO

-- 4. Tạo bảng properties (Tòa nhà) nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'properties')
BEGIN
    CREATE TABLE properties (
        property_id INT IDENTITY PRIMARY KEY,
        landlord_id INT NOT NULL,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NULL,
        address NVARCHAR(500) NOT NULL,
        city NVARCHAR(100) NOT NULL,
        district NVARCHAR(100) NULL,
        ward NVARCHAR(100) NULL,
        total_floors INT DEFAULT 1,
        thumbnail_url NVARCHAR(500) NULL,
        status VARCHAR(15) DEFAULT 'active',
        is_deleted BIT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),

        FOREIGN KEY (landlord_id) REFERENCES users(user_id)
    );
END
GO

-- 5. Thêm các cột bị thiếu vào bảng rooms
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('rooms') AND name = 'property_id')
BEGIN
    ALTER TABLE rooms ADD property_id INT NULL;
    ALTER TABLE rooms ADD floor INT NULL;
    ALTER TABLE rooms ADD room_number VARCHAR(20) NULL;
    
    ALTER TABLE rooms ADD CONSTRAINT FK_rooms_properties FOREIGN KEY (property_id) REFERENCES properties(property_id);
END
GO
