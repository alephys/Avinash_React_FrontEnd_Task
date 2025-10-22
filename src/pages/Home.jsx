    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import axios from "axios";

    import TopicView from "../components/ViewTopic";

    const Home = () => {
    const [messages, setMessages] = useState([]);
    const [topicName, setTopicName] = useState("");
    const [partitions, setPartitions] = useState(1);
        const [createdTopics, setCreatedTopics] = useState([]); // topics already approved and created
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [username, setUsername] = useState("");
    const [uncreatedRequests, setUncreatedRequests] = useState([]);

    const navigate = useNavigate();

    // ------------------ Fetch dashboard data ------------------
    useEffect(() => {
        const fetchDashboard = async () => {
        try {
            const { data } = await axios.get("/api/home_api/");
            setUncreatedRequests(data.uncreated_requests || []);
            setCreatedTopics(data.created_topics || []); // approved & created topics
            setUsername(data.username || "Guest");
        } catch (err) {
            console.error("Failed to fetch dashboard:", err);
            setMessages([{ text: "Failed to load dashboard data", type: "error" }]);
        }
        };
        fetchDashboard();
    }, []);



    // ------------------ Submit a new topic request ------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
    const payload = { topic_name: topicName, partitions: Number(partitions) };

    try {
        const { data } = await axios.post("/api/home_api/", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        });

        setMessages([
        { text: data.message, type: data.success ? "success" : "error" },
        ]);

        if (data.success) {
        setTopicName("");
        setPartitions(1);
        }
    } catch (err) {
        console.error("Error creating topic:", err.response?.data || err.message);
        setMessages([
        {
            text: err.response?.data?.message || "Failed to send topic request",
            type: "error",
        },
        ]);
    }
    };


    //  ---------------create topic button ------------------

    const handleCreateTopic = async (id) => {
      try {
        const { data } = await axios.post(`/api/create_topic_api/${id}/`);
        setMessages([
          { text: data.message, type: data.success ? "success" : "error" },
        ]);
      } catch (err) {
        console.error(err);
        setMessages([{ text: "Topic creation failed", type: "error" }]);
      }
    };

// created Topic table

    // ------------------ View topic details ------------------
    const handleViewTopic = async (topicName) => {
        try {
        const { data } = await axios.get(`/api/topic/${topicName}/`);
        setSelectedTopic(data);
        } catch (err) {
        console.error(err);
        setMessages([{ text: "Unable to fetch topic details", type: "error" }]);
        }
    };

    // ------------------ Delete created topic ------------------
    const handleDeleteTopic = async (id) => {
        try {
        const { data } = await axios.delete(`/api/delete_topic/${id}/`);
        setMessages([{ text: data.message, type: data.success ? "success" : "error" }]);
        if (data.success) {
            setCreatedTopics((prev) => prev.filter((t) => t.id !== id));
        }
        } catch (err) {
        console.error(err);
        setMessages([{ text: "Delete failed", type: "error" }]);
        }
    };

    // ------------------ Logout user ------------------
    const handleLogout = async () => {
        try {
        const { data } = await axios.post("/api/logout_api/");
        if (data.success) {
            navigate("/login");
        } else {
            setMessages([{ text: "Logout failed", type: "error" }]);
        }
        } catch (err) {
        console.error(err);
        setMessages([{ text: "Logout request failed", type: "error" }]);
        }
    };
    

    return (
      <div className="max-w-10xl mx-auto p-5 font-sans">
        {/* Header */}
        <header className="flex justify-center items-center mb-5 py-3 border-b border-gray-300 relative">
          <h1 className="text-3xl font-bold text-gray-800">
            Kafka Topic Manager
          </h1>
          <div className="absolute top-2 right-5 flex items-center gap-3">
            <span className="text-gray-700 text-base">{username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-52 p-5 bg-gray-50 border-r border-gray-300 mb-5 md:mb-0 md:mr-5 rounded-md md:rounded-none">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              My Topics
            </h2>
            {createdTopics.length > 0 ? (
              <ul className="space-y-2">
                {createdTopics.map((topic) => (
                  <li
                    key={topic.id}
                    className="bg-white shadow-sm border rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="font-medium">{topic.name}</div>
                    <div className="text-sm text-gray-500">
                      Partitions: {topic.partitions}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">
                No topics yet. Create one!
              </p>
            )}
          </aside>

          {/* Main */}
          <main className="flex-1 p-5 bg-gray-100 rounded-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              User Dashboard
            </h2>

            {/* Messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 mb-3 rounded text-sm font-medium ${
                  msg.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Request New Topic */}
            <div className="bg-white rounded-lg p-5 mb-5 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Request a New Topic
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-600 mb-1">Topic Name</label>
                  <input
                    type="text"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Number of Partitions
                  </label>
                  <input
                    type="number"
                    value={partitions}
                    onChange={(e) => setPartitions(e.target.value)}
                    min="1"
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium"
                >
                  Submit Request
                </button>
              </form>
            </div>

            {/* Approved topic Requests */}
            <div className="bg-white rounded-lg p-5 mb-5 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Approved Topic Requests
              </h2>
              {uncreatedRequests.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2 text-left">Topic Name</th>
                      <th className="p-2 text-left">Partitions</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uncreatedRequests.map((req) => (
                      <tr key={req.id} className="border-b border-gray-200">
                        <td className="p-2">{req.topic_name}</td>
                        <td className="p-2">{req.partitions}</td>
                        <td className="p-2">{req.status}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleCreateTopic(req.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Create topic
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">
                  No Approved requests.
                </p>
              )}
            </div>

            {/* Created Topics */}
            <div className="bg-white rounded-lg p-5 mb-5 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Created Topics
              </h2>
              {createdTopics.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2 text-left">Topic Name</th>
                      <th className="p-2 text-left">Partitions</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdTopics.map((topic) => (
                      <tr key={topic.id} className="border-b border-gray-200">
                        <td className="p-2">{topic.name}</td>
                        <td className="p-2">{topic.partitions}</td>
                        <td className="p-2 space-x-2">
                          <button
                            onClick={() => handleViewTopic(topic.name)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">
                  No created topics yet.
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    );
    };

    export default Home;
