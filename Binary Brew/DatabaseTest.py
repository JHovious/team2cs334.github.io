import psycopg2

# this just ensures you can connect to the database

def main():
    conn = psycopg2.connect('postgres://avnadmin:AVNS_IMr3mTXL81VOH9I4Eo7@pg-3c581a77-vehicles09.g.aivencloud.com:21946/defaultdb?sslmode=require')

    query_sql = 'SELECT VERSION()'

    cur = conn.cursor()
    cur.execute(query_sql)

    version = cur.fetchone()[0]
    print(version)


if __name__ == "__main__":
    main()
