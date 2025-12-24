-- Create fee_structure table
CREATE TABLE IF NOT EXISTS fee_structure (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount FLOAT NOT NULL DEFAULT 0.0,
    is_per_credit BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample fee structure data
INSERT INTO fee_structure (category, name, amount, is_per_credit, is_active, display_order) VALUES
('tuition', 'Registration Fee', 500.00, FALSE, TRUE, 1),
('tuition', 'Library Fee', 200.00, FALSE, TRUE, 2),
('tuition', 'Technology Fee', 300.00, FALSE, TRUE, 3),
('bus', 'Bus Service (Semester)', 800.00, FALSE, TRUE, 1);

-- Verify the data
SELECT * FROM fee_structure;
