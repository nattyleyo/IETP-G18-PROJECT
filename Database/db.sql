-- Create Users table
CREATE TABLE users (
    UserID VARCHAR(255) PRIMARY KEY,
    UserName VARCHAR(255),
    UserAddress VARCHAR(255),
    UserEmail VARCHAR(255),
    Phone VARCHAR(20),
    AccountBalance DECIMAL(10, 2)
);

-- Create Vehicles table
CREATE TABLE Vehicles (
    VehicleID VARCHAR(255) PRIMARY KEY,
    UserID VARCHAR(255),
    LicenseNumber VARCHAR(20),
    VehicleType VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
-- Create TollBooths table
CREATE TABLE TollBooths (
    TollBoothID varchar(255) PRIMARY KEY,
    Name VARCHAR(255),
    Location VARCHAR(255)
);

-- Create RFIDTags table
CREATE TABLE RFIDTags (
    RFIDTagID INT PRIMARY KEY,
    VehicleID INT,
    TagCode VARCHAR(255),
    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID)
);
-- Create Transactions table
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID VARCHAR(255),
    VehicleID VARCHAR(255),
    Timestamp TIMESTAMP,
    Amount DECIMAL(10, 2),
    Status VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID)
);
-- Create Operators table
CREATE TABLE Operators (
    OperatorID INT PRIMARY KEY,
    Name VARCHAR(255),
    Role VARCHAR(255)
);
