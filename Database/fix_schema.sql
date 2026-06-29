USE RentalRoomSystem;
GO

-- Add missing columns to rooms
ALTER TABLE rooms ADD bedrooms INT DEFAULT 1;
GO
ALTER TABLE rooms ALTER COLUMN room_type VARCHAR(15);
GO

-- Add missing columns to payments
ALTER TABLE payments ADD platform_fee DECIMAL(10,2) DEFAULT 0;
GO
ALTER TABLE payments ADD net_amount DECIMAL(10,2) DEFAULT 0;
GO
ALTER TABLE payments ADD payout_status VARCHAR(15) DEFAULT 'pending';
GO
ALTER TABLE payments ADD payout_date DATETIME NULL;
GO

-- Create favorites table
CREATE TABLE favorites (
    favorite_id INT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL,
    room_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (tenant_id) REFERENCES users(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    CONSTRAINT UQ_favorites_tenant_room UNIQUE (tenant_id, room_id)
);
GO
CREATE INDEX idx_favorites_tenant ON favorites(tenant_id);
GO
CREATE INDEX idx_favorites_room ON favorites(room_id);
GO
