import numpy as np
import matplotlib.pyplot as plt

hkData = np.loadtxt('hk_results.csv', delimiter=',',skiprows=1,unpack=True)
lsData = np.loadtxt('ls_results.csv', delimiter=',',skiprows=1,unpack=True)
hkN = hkData[0]
lsN = lsData[0]
hkTime = hkData[1]
lsTime = lsData[1]
hkLength = hkData[2]
lsLength = lsData[2]

plt.plot(hkN, hkTime, label="Held-Karp")
plt.plot(lsN, lsTime, label="Local-Search")
plt.title("Runtime for Held-Karp and Local-Search")
plt.xlabel("n")
plt.ylabel("time (ms)")
plt.legend(framealpha=1)
plt.savefig("timeVsN.png")
plt.close()

smallest = min(len(hkN),len(lsN))

for i in range(smallest):
    if lsLength[i] < hkLength[i]:
        print(f"Problem at n={hkN[i]}: LS={lsLength[i]}, HK={hkLength[i]}")

lsError = []
lsNewN = []
for i in range(smallest):
    lsNewN.append(i)
    lsError.append(lsLength[i]-hkLength[i])

plt.plot(lsNewN, lsError)
plt.title("Error for Local-Search vs Help-Karp")
plt.xlabel("n")
plt.ylabel("Error of Local-Search")
plt.grid(True)
plt.savefig("lsError.png")