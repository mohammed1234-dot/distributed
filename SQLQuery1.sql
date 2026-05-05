-- 1. Create the Users Table
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

-- 2. Create the Tasks Table
CREATE TABLE tasks (
    task_id INT IDENTITY(1,1) PRIMARY KEY,
    owner_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    -- SQL Server doesn't use ENUM, we use CHECK constraints instead
    priority NVARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    status NVARCHAR(15) CHECK (status IN ('todo', 'inprogress', 'done')) DEFAULT 'todo',
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Create the Shared Tasks Table
CREATE TABLE shared_tasks (
    share_id INT IDENTITY(1,1) PRIMARY KEY,
    task_id INT NOT NULL,
    shared_with_user_id INT NOT NULL,
    shared_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_user_id) REFERENCES users(user_id) ON DELETE NO ACTION,
    CONSTRAINT unique_share UNIQUE (task_id, shared_with_user_id)
);