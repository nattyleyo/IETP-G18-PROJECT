-- Create Users table
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Name VARCHAR(255),
    Address VARCHAR(255),
    Email VARCHAR(255),
    Phone VARCHAR(20),
    AccountBalance DECIMAL(10, 2)
);
-- Create Vehicles table
CREATE TABLE Vehicles (
    VehicleID INT PRIMARY KEY,
    UserID INT,
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
    TransactionID INT PRIMARY KEY,
    UserID INT,
    VehicleID INT,
    TollBoothID INT,
    Timestamp TIMESTAMP,
    Amount DECIMAL(10, 2),
    Status ENUM('Authorized', 'Unauthorized'),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID),
    FOREIGN KEY (TollBoothID) REFERENCES TollBooths(TollBoothID)
);
-- Create Operators table
CREATE TABLE Operators (
    OperatorID INT PRIMARY KEY,
    Name VARCHAR(255),
    Role VARCHAR(255)
);