# Traveling Salesperson Problem -- Empirical Analysis

For this exercise, you'll need to take the code from the TSP Held-Karp and TSP
Local Search exercises. This can be your own implementation or somebody else's.
You will now do an empirical analysis of the implementations, comparing their
performance. Both the Held-Karp and the Local Search algorithms solve the same
problem, but they do so in completely different ways. This results in different
solutions, and in different times required to get to the solution.

Investigate the implementations' empirical time complexity, i.e. how the runtime
increases as the input size increases. *Measure* this time by running the code
instead of reasoning from the asymptotic complexity (this is the empirical
part). Create inputs of different sizes and plot how the runtime scales (input
size on the $x$ axis, time on the $y$ axis). Your largest input should have a
runtime of *at least* an hour. The input size that gets you to an hour will
probably not be the same for the Held-Karp and Local Search implementations.

In addition to the measured runtime, plot the tour lengths obtained by both
implementations on the same input distance matrices. The length of the tour that
Held-Karp found should always be less than or equal to the tour length that
Local Search found. Why is this?

Add the code to run your experiments, graphs, and an explanation of what you did
to this markdown file.

# Methodology

For this exercise I first put both of my TSP algorithms inside of  ```getData.js```. This file runs the "experiments" and outputs the data for both Held-Karp (HK) and Local-Search (LS) to csv files. 

I also wanted to make sure each algorithm was using the same matrices. For this, I created ```bankGen.js```. This script creates (and saves) a LOT of matricies for increasing sizes. It slowly increases the gap between each saved matrix as to save space for storage. When I ran it on ARCC's moran partition, I used 25,000 for the max n. These matrices are the matrices that the algorithms used to find solve the TSP problem.

I then used ```plot.py``` to plot/visualize the data. I plotted the runtime of both algorithms as a function of n, as well as the error of LS. This error is just how much greater the path length is relative to the same HK output.

All of these were ran on the ARCC moran partition with a maximum of 6 hours for the whole thing, including bank generation.

# Results

I ran into two problems with this. First, I could not get the HK algorithm to run past n=20, it just kept running out of memory/RAM. This means that I am only able to compare the two directly for 1<n<21. Also, at n=20, it only took about 99 seconds, nowhere near the desired 1 hour mark.

The second issue was with the LS experiment. I could only get it to run to about n=11,700 until it also ran out of memory/RAM. This massive n only took about 219 seconds, which is still nowhere near 1 hour. However, I believe I was able to get good data on the asymptotic behavior of both. The figure below shows the runtime as a function of n, restricted to a domain of 0 to 20. See ```timeVsNnarrow.png``` for file.

![timeVsNnarrow](https://github.com/user-attachments/assets/cd7763da-c761-490b-abfa-fd0a4922f00b)

Here we can clearly see that the HK algorithm exponetially increases its runtime as n increases. If we compare it to LS, the LS doesn't even seem to change at such low values of n. 

The plot below shows the total runtime for both algorithms, with no restriction on the domain (until it reached the end of the LS's capabilities). See ```timeVsN.png``` for file.

![timeVsN](https://github.com/user-attachments/assets/bb493207-cfef-4721-91e4-b9e46b51160e)

Here we can clearly see that it takes an _extremely_ large n for LS to take anywhere near as long as HK. However, we have to keep in mind that HK always finds the optimal path. To show this, I have plot the error of the LS algorithm as a function of n. The error in this case is simply LS-Length - HK-Length for some value of n. This is why I wanted to ensure that both algorithms used the same matricies (via ```bankGen.js```). See figure below or ```lsError.png``` for file.

![lsError](https://github.com/user-attachments/assets/59d0e821-d150-41d0-8955-424477bcebc7)

Here we can see that the LS error has a clear positive correlation with n. This means that for extremely large values of n, we get extremely large error values.

I have included the SLURM console outputs if you would like to see the execution of the experiments. See ```slurm-59*.out```



# Disclaimer

I used my computational physics II (PHYS4840) ARCC account and methods to run the experiments.

I certify that I have listed all sources used to complete this exercise, including the use of any Large Language Models. All of the work is my own, except where stated otherwise. I am aware that plagiarism carries severe penalties and that if plagiarism is suspected, charges may be filed against me without prior notice.
