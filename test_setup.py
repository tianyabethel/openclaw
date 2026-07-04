import sys
import mysql.connector

def test_python_version():
    assert sys.version_info >= (3, 11), "Python 3.11+ required"
    print("✓ Python version OK")

def test_mysql():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Ilovesammy1!",
            database="idx_exchange"
        )

        cursor = conn.cursor()

        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()

        print("\nTables:")
        for table in tables:
            print("-", table[0])

        conn.close()
        print("\n✓ MySQL connection successful")

    except Exception as e:
        print("Connection failed:")
        print(e)

if __name__ == "__main__":
    test_python_version()
    test_mysql()
    print("\nSetup verification complete!")
