const SidebarButton = ({ icon: Icon, name }: { icon: any; name: string }) => {
  return (
    <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:color rounded-lg transition-all">
      <Icon className="w-5 h-5 mr-2" />
      <span>{name}</span>
    </button>
  );
};

export default SidebarButton;
