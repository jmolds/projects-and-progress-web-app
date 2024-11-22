
import { fetchSignalsManifest , fetchSignalData} from '@/utils/projectSignalsFetch';
import SignalSection from '@/components/SignalSection';

const ProjectDashboard = ({ projectId, signalsData, color, error }) => {
  if (error) {
    return (
      <div>
        <h1>Error Loading Project Dashboard</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard for Project: {projectId}</h1>

      {/* Render Signal Sections */}
      {signalsData && signalsData.length > 0 ? (
        signalsData.map(({ signalId, signalLabel, data }) => (
          <SignalSection
            key={signalId}
            signalId={signalId}
            signalLabel={signalLabel}
            projectId={projectId}
            signalData={data}
            color={color}
          />
        ))
      ) : (
        <p>No signals available for this project.</p>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const { projectId } = context.params;
    const { color } = context.query;

    // Convert spaces to underscores and uppercase for manifest access
    const projectIdWithUnderscores = projectId.replace(/ /g, '_').toUpperCase();

    // Fetch the signals manifest
    const manifest = await fetchSignalsManifest();
    if (!manifest) {
      throw new Error('Failed to fetch signals manifest.');
    }

    const projectManifest = manifest[projectIdWithUnderscores];
    if (!projectManifest) {
      throw new Error(`Project '${projectIdWithUnderscores}' not found in manifest.`);
    }

    const signals = projectManifest.signals;

    // Fetch data for each signal
    const signalDataPromises = Object.entries(signals).map(async ([signalId, signalInfo]) => {
      const data = await fetchSignalData(projectIdWithUnderscores, signalId, signalInfo);
      return { signalId, signalLabel: signalInfo.signalLabel, data };
    });

    const signalsData = await Promise.all(signalDataPromises);

    return {
      props: {
        projectId,
        signalsData,
        color,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
}

export default ProjectDashboard;
