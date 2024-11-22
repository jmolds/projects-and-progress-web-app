// pages/dashboard.js

const Dashboard = ({ events }) => {
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <h2>Events Data:</h2>
                <pre>{JSON.stringify(events, null, 2)}</pre>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const eventsSnapshot = await firestore.collection('events').get();
    const events = eventsSnapshot.docs.map(doc => doc.data());

    return { props: { events } };
}

export default Dashboard;
