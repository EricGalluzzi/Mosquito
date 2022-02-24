from flask import Flask, redirect, url_for, request, jsonify
import json
app = Flask(__name__)
@app.route('/alert', methods = ['POST'])
def alertSystem():
    data = request.json if request.json !=None else 0
    output = []
    if data == 0:
        return jsonify("No Data to make decision")
    for info in data:
    
        if(info.get('PRCP') > .30): #see if this works and gives average.
            avgTemp = sum(info.get('TEMP'))/len(info.get('TEMP'))
            avgHumidity = sum(info.get('Humidity'))/len(info.get('Humidity'))
            soilMoisture = info.get('SM') #possibly try to predict this too/convert
            if(avgTemp >= 80.6 and avgHumidity > 85 and soilMoisture > 60):
                output.append(({'sensorID' : info.get('sensorID'),'info' : "High Risk in 5-7 days", 'risk': 2}))
            elif(avgTemp >= 80.6 or avgHumidity > 85 or soilMoisture > 60):
                output.append(({'sensorID' : info.get('sensorID'),'info' : "Moderate Risk in 5-7 days", 'risk': 1}))   
        else :
            output.append(({'sensorID' : info.get('sensorID'), 'info' : "Low Risk Factor Detected", 'risk': 0}))
        
    return jsonify(output)

if __name__ == '__main__':
    app.run(host='0.0.0.0')