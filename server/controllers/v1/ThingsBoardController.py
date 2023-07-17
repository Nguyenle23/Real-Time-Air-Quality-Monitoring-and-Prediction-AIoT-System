from flask import jsonify
import requests
import csv
import pandas as pd

class ThingsBoardController:
  def fetchAllData():
    # getUser = DBConnection('bills').where('userID', '==', userID)
    # userBill = getUser.get()
    # data = []
    # for i in userBill:
    # data.append(i.to_dict())
    token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZW5hbnRAdGhpbmdzYm9hcmQub3JnIiwidXNlcklkIjoiZjgwZTI2ZjAtZWZjYi0xMWVkLWE4MTItNmIwZmU4ZGYzMGY4Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJlMDdiMjJjZC0zOWViLTQ3ZGMtOTUzMC0yMzExN2ViOTJjNWUiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTY4OTYwNjcwNCwiZXhwIjoxNjg5NjE1NzA0LCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiZjY0YTJmZDAtZWZjYi0xMWVkLWE4MTItNmIwZmU4ZGYzMGY4IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.vtUPw6goPZyCS6nuDXBGPyQJgjhtx4ki2jdYWN0bA44AzjViPjmZ4YptjzzLRxIGYxUnQTJrL2Y7pessosYfbQ"
    field1 = "temp"
    field2 = "humi"
    field3 = "mq135"
    field4 = "mq7"
    field5 = "pm2.5"
    field6 = "uv_index"
    field7 = "dewpoint"
    deviceID = "8b6df0a0-23a8-11ee-8629-f3133190e26b"
    start = "1689465600000"
    end = "1689552000000"
    sort = "ASC"
    host = "192.168.1.29:8080"

    # Define the fields
    fields = ["temp", "humi", "mq135", "mq7", "pm2.5", "uv_index"]

    url = "http://" + host + "/api/plugins/telemetry/DEVICE/" + deviceID + \
          "/values/timeseries?keys=" + ','.join(fields) + "&startTs=" + \
          start + "&endTs=" + end + "&sortOrder=" + sort
    headers = {
        'Accept': 'application/json',
        'Authorization': "Bearer " + token
    }
    response = requests.request("GET", url, headers=headers)
    data = response.json()

    df = pd.DataFrame(data)

    # Convert timestamps to a sortable format
    df.index = pd.to_datetime(df.index, unit='ms')

    # Sort the DataFrame by timestamps
    df.sort_index(inplace=True)

    # Prepare the CSV file
    csv_file = "data.csv"

    # Export the DataFrame to CSV
    df.to_csv(csv_file, index=False)

    print("CSV file created successfully.")

# get data from thingsboard
# for field in [field1, field2, field3, field4, field5, field6, field7]:
#     url = "http://" + host + "/api/plugins/telemetry/DEVICE/" + deviceID + \
#         "/values/timeseries?keys=" + field + "&startTs=" + \
#         start + "&endTs=" + end + "&sortOrder=" + sort
#     headers = {
#         'Accept': 'application/json',
#         'Authorization': "Bearer " + token
#     }
#     response = requests.request("GET", url, headers=headers)
#     print(response)
# # format data
# data = response.json()
# print(data)

# return jsonify({
#     'status': 'success',
#     'result': data
# })

# write data to csv file
# data = response.json()

# for i in data[field]:
#     i['ts'] = i['ts'] + 25200000

# with open('data.csv', 'w', newline='') as csvfile:
#     fieldnames = ['timestamp', 'value']
#     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
#     writer.writeheader()
#     for i in data[field]:
#         writer.writerow({'timestamp': i['ts'], 'value': i['value']})
# return jsonify({
#     'status': 'success',
#     'result': data
# })
