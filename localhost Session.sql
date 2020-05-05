select * from menino;

ALTER TABLE menino MODIFY COLUMN Nome VARCHAR(100) NOT NULL;

ALTER TABLE menino RENAME COLUMN Nome TO NomeMenino;
