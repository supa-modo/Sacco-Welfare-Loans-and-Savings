const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-${trend.color}-600 text-sm font-medium`}>
            {trend.value}
          </span>
          <span className="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
