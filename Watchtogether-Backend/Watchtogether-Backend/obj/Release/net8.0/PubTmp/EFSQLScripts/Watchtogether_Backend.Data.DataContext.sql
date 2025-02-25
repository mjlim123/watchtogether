IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240304083143_ChangeDateTime'
)
BEGIN
    CREATE TABLE [Message] (
        [MessageId] nvarchar(450) NOT NULL,
        [Contents] nvarchar(max) NOT NULL,
        [Author] nvarchar(max) NOT NULL,
        [RoomId] nvarchar(max) NOT NULL,
        [SentAt] datetime NOT NULL,
        CONSTRAINT [PK_Message] PRIMARY KEY ([MessageId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240304083143_ChangeDateTime'
)
BEGIN
    CREATE TABLE [Room] (
        [RoomId] nvarchar(450) NOT NULL,
        [RoomName] nvarchar(max) NOT NULL,
        [RoomCode] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Room] PRIMARY KEY ([RoomId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240304083143_ChangeDateTime'
)
BEGIN
    CREATE TABLE [User] (
        [UserId] nvarchar(450) NOT NULL,
        [UserName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_User] PRIMARY KEY ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240304083143_ChangeDateTime'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20240304083143_ChangeDateTime', N'8.0.2');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240305012449_production'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20240305012449_production', N'8.0.2');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240311224530_addvideofield'
)
BEGIN
    ALTER TABLE [Room] ADD [CurrentVideo] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240311224530_addvideofield'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20240311224530_addvideofield', N'8.0.2');
END;
GO

COMMIT;
GO

