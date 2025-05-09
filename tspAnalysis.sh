#!/bin/bash

#SBATCH --account=phys4840
#SBATCH --time=6:00:00
#SBATCH --ntasks-per-node=5
#SBATCH --cpus-per-task=18

### ^^ above, the computing parameters for your simulations are set ^^

### below, your environment variables are set
export MESA_DIR=/project/phys4840/software/mesa/mesa-24.08.1
export MESASDK_ROOT=/project/phys4840/software/mesa/mesasdk
source $MESASDK_ROOT/bin/mesasdk_init.sh
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
echo "communal ARCC MESA version loaded"

### navigate to where your MESA test_suite case is located
cd /home/cworsley/tspComparison

### now, run your MESA commands 
node bankGen.js  ##  once your MESA executable is built once, 
node getData.js     ##  you actually don't need either of these commands
