import pandas as pd

data = pd.read_csv('public/data/project_savings.csv')
data = data.rename(columns = {
    'CO 2 Tons': 'CO2 Tons Diverted',
    'Annual Fuel Dollars': 'Annual Fuel Dollars Saved',
    'Annual Electric Dollars': 'Annual Electric Dollars Saved',

})
data['Annual Fuel Therms Saved'] = data['Annual Fuel Therms Saved'].fillna(0);
data['HVAC Duct Efficiency Improved'] = data['HVAC Duct Efficiency Improved'].fillna(0);
data.to_csv('public/data/project_savings.csv', index=False)