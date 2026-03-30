import requests

base='http://127.0.0.1:8000'
print(requests.get(base+'/').json())
r=requests.post(base+'/api/auth/entreprise/inscription', json={'nom_entreprise':'DebugTest','email':'debug-test@example.com','mot_de_passe':'Test1234!'})
print('signup', r.status_code, r.text)
r2=requests.get(base+'/api/auth/entreprise/debug/entreprises')
print('debug', r2.status_code, r2.text)
