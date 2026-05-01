import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateProblemForm from '../components/CreateProblemForm';
import { useProblemStore } from '../store/useProblemStore';

const EditProblem = () => {
  const { id } = useParams();
  const { problem, getProblemById, isProblemLoading } = useProblemStore();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      getProblemById(id).then(() => setDataLoaded(true));
    }
  }, [id, getProblemById]);

  if (isProblemLoading || !dataLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-error">Problem not found</h2>
      </div>
    );
  }

  return (
    <div>
      <CreateProblemForm initialData={problem} problemId={id} isEditMode={true} />
    </div>
  );
};

export default EditProblem;
